import { FormFactor, InternalConnectors, Primitive } from "../../interface";
import { createDTO, createModel } from "../../utils";
import { z } from "zod";

const Info = z.object({
  form_factor: FormFactor.Mainboard,

  socket: Primitive.String,
  chipset: Primitive.String,

  ram_form_factor: FormFactor.RAM,
  ram_interface: InternalConnectors.RAM,
  ram_slot: Primitive.Number,
});

export type Info = z.infer<typeof Info>;

export const Label: { [key in keyof Info]: string } = {
  form_factor: "Form Factor",

  socket: "Socket",
  chipset: "Chipset",

  ram_form_factor: "RAM Form Factor",
  ram_interface: "RAM Interface",
  ram_slot: "RAM Slots",
};

const Model = createModel(Info);

export type Model = z.infer<typeof Model>;

const DTO = createDTO(Info);

export type DTO = z.infer<typeof DTO>;

export const Schemas = { Info, Model, DTO };
