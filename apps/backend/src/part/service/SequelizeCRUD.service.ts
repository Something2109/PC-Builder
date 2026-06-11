import { Injectable } from "@nestjs/common";
import { Includeable, Model, ModelStatic, Transaction } from "sequelize";
import { Sequelize } from "sequelize-typescript";

import { ModelScopes } from "@/models/interface";
import { PartInformation } from "@/models/parts";
import Part, { Infos, Products } from "@/utils/part";

import { DatabaseCRUDInterface } from "../interface/database.interface";

@Injectable()
class SequelizeCRUDService implements DatabaseCRUDInterface {
  private _PartModel?: ModelStatic<PartInformation>;
  private _InfoModels?: { [key in Infos]: ModelStatic<any> };

  private get PartModel(): ModelStatic<PartInformation> {
    if (!this._PartModel) {
      this._PartModel = PartInformation.scope(ModelScopes.DETAIL);
    }
    return this._PartModel;
  }

  private get InfoModels(): { [key in Infos]: ModelStatic<any> } {
    if (!this._InfoModels) {
      this._InfoModels = Object.entries(PartInformation.associations).reduce(
        (acc, [key, association]) => {
          const info = key as Infos;
          acc[info] = association.target.scope(ModelScopes.DETAIL);
          return acc;
        },
        {} as { [key in Infos]: ModelStatic<any> },
      );
    }
    return this._InfoModels;
  }

  constructor(private readonly sequelize: Sequelize) {}

  async get(
    id: string,
    infos?: Infos[],
    transaction?: Transaction,
  ): Promise<Part.Model | null> {
    const include = this.infoToModel(infos);

    const instance = await this.PartModel.findByPk(id, {
      include,
      transaction,
    });

    return instance?.toJSON() ?? null;
  }

  async set(
    id: string,
    { part, ...data }: Part.DTO,
    infos?: Infos[],
  ): Promise<Part.Model | null> {
    return await this.sequelize.transaction(async (transaction) => {
      const instance =
        (await this.validateCodename(data.code_name, id, transaction)) ||
        (await this.PartModel.findByPk(id, { transaction }));
      if (!instance) return null;

      instance.set(data);
      if (!instance.part) instance.part = part as Products;

      await instance.save({ transaction });

      if (infos) {
        await Promise.all(
          infos.map((info) =>
            this.setInfo(id, info, data[info], transaction),
          ),
        );
      }

      return await this.get(id, infos, transaction);
    });
  }

  async create(data: Part.DTO, infos?: Infos[]): Promise<Part.Model> {
    return (await this.sequelize.transaction(async (transaction) => {
      let instance =
        (await this.validateCodename(data.code_name, undefined, transaction)) ||
        PartInformation.build(data);

      instance.set(data);

      instance = await instance.save({ transaction });

      if (infos) {
        await Promise.all(
          infos.map((info) =>
            this.setInfo(instance.id, info, data[info], transaction),
          ),
        );
      }

      return (await this.get(instance.id, infos, transaction))!;
    }))!;
  }

  async delete(id: string, infos?: Infos[]): Promise<Part.Model | null> {
    const include = this.infoToModel(infos);

    return await this.sequelize.transaction(async (transaction) => {
      const instance = await this.PartModel.findByPk(id, {
        include,
        transaction,
      });
      if (!instance) return null;

      await instance.destroy({ transaction });

      return instance.toJSON();
    });
  }

  /**
   * Map the info enum to models.
   * @param infos The info list.
   * @returns The model list mapped from the info list.
   */
  protected infoToModel(infos?: Infos[]): Includeable[] {
    if (!infos) return [];

    return infos.map((info) => this.InfoModels[info]);
  }

  /**
   * Validate if the code name of the model has existed or not
   * @param code_name
   * @param id The optional id for validating if the model
   * @returns The part instance if the code name and id mapped to one object else null.
   */
  protected async validateCodename(
    code_name: string,
    id?: string,
    transaction?: Transaction,
  ) {
    if (!code_name) return undefined;

    const instance = await this.PartModel.findOne({
      where: { code_name },
      transaction,
    });
    if (instance && instance.id !== id)
      throw new Error(`Part already exists with the code name: ${code_name}`);

    return instance;
  }

  /**
   * Update the info related to the {@link id} and {@link info} parameter
   * from the {@link data} parameter.
   * The function will first map the old value from the primary keys of the instance
   * to distinguish the already created data and the new one.
   * Based on the mapping, the function will choose to update the current instance or
   * create the new instance for the {@link data}.
   * Then it deletes the old deprecated instances and save the new instances.
   * @param id The id of the product to update info.
   * @param info The info to update data.
   * @param data The data to update.
   */
  protected async setInfo(
    id: string,
    info: Infos,
    data: Part.DTO[typeof info],
    transaction?: Transaction,
  ): Promise<void> {
    // If data is undefined (no operation specified)
    if (data === undefined) return;

    const instances = await this.InfoModels[info].findAll({
      where: { id },
      transaction,
    });

    // If data is null (delete the info)
    if (data === null) {
      instances.forEach((value) => value.destroy({ transaction }));
      return;
    }

    const dataArr = Array.isArray(data) ? data : [data];
    const primaryKeys = this.InfoModels[info].primaryKeyAttributes;

    // Map the old value based on the primary keys of it
    const oldInstances = instances.reduce<{
      [key in string]: Model<any, any>;
    }>((acc, value) => {
      const key = this.hashByAttributes(value, primaryKeys);
      console.log(info, key);
      acc[key] = value;
      return acc;
    }, {});

    // resolve the data based on the old value
    const newInstances = dataArr.map((value) => {
      const key = this.hashByAttributes({ id, ...value }, primaryKeys);

      // if no old data existed
      if (!oldInstances[key])
        return this.InfoModels[info].build({ id, ...value });

      // if old data existed
      const infoInstance = oldInstances[key];

      delete oldInstances[key];

      infoInstance.set(value);

      return infoInstance;
    });

    // destroy the unused old data and save the new data
    await Promise.all([
      ...Object.values(oldInstances).map((value) =>
        value.destroy({ transaction }),
      ),
      ...newInstances.map((value) => value.save({ transaction })),
    ]);
  }

  /**
   * Create a string that is a combination of the given key of an object.
   * @param instance The object containing the key to hash.
   * @param attrs The attributes used in the hash.
   * @returns The hashed string.
   */
  protected hashByAttributes<T extends string>(
    instance: { [key in T]: any },
    attrs: readonly T[],
  ) {
    return attrs.map((value) => instance[value]).join("-");
  }
}

export { SequelizeCRUDService };
