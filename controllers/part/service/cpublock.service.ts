import { Injectable } from "@nestjs/common";
import Part from "@/utils/interface/part/Parts";
import { Products } from "@/utils/Enum";
import CPUBlock from "@/utils/interface/part/CPUBlock";
import { BaseDetailPartService } from "../interface/service.interface";
import { DetailInfoOptions } from "@/utils/interface";
import { CPUBlockSocketModel } from "@/models/parts/tables/CPUBlock";

type Detail = Part.BasicInfo & {
  [Products.CPU_BLOCK]: CPUBlock.Info;
};

@Injectable()
class CPUBlockService extends BaseDetailPartService<Detail> {
  readonly part = Products.CPU_BLOCK;

  async create({
    [this.part]: data,
    ...part
  }: DetailInfoOptions): Promise<string | Detail> {
    let socket: string[] | undefined;
    if (data) ({ socket, ...data } = data);

    const partInstance = await super.create({ ...part, [this.part]: data });
    if (typeof partInstance === "string") return partInstance;

    await this.setSocket(partInstance.id, socket);

    return (await this.get(partInstance.id)) as Detail;
  }

  async set(
    { [this.part]: data, ...part }: DetailInfoOptions,
    id: string
  ): Promise<string | Detail | null> {
    let socket: string[] | undefined;
    if (data) ({ socket, ...data } = data);

    const partInstance = await super.set({ ...part, [this.part]: data }, id);
    if (!partInstance || typeof partInstance === "string") return partInstance;

    await this.setSocket(partInstance.id, socket);

    return (await this.get(id)) as Detail;
  }

  private async setSocket(id: string, socket?: string[]): Promise<void> {
    if (socket) {
      await CPUBlockSocketModel.destroy({ where: { id } });

      await CPUBlockSocketModel.bulkCreate(
        socket.map((socket) => ({ id, socket }))
      );
    }
  }
}

export { CPUBlockService };
