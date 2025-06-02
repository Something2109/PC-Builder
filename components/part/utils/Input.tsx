import { Input, OptionSelect } from "@/components/utils/Input";
import { ExternalPorts } from "@/utils/interface/utils";
import {
  ChangeEventHandler,
  FunctionComponent,
  RefObject,
  useRef,
} from "react";

const NetworkInputFields: Record<
  ExternalPorts.Network.Type,
  FunctionComponent<{ ref: RefObject<HTMLInputElement | null> }>
> = {
  "LAN Ethernet": ({ ref }: { ref: RefObject<HTMLInputElement | null> }) => {
    const SpeedRef = useRef<HTMLSelectElement>(null);
    const InterfaceRef = useRef<HTMLSelectElement>(null);

    const defaultValue = ExternalPorts.Network.Ethernet.toString(
      ExternalPorts.Network.Ethernet.Speed.options[0],
      ExternalPorts.Network.Ethernet.Interface.options[0]
    );
    const onChange = () =>
      (ref.current!.value = ExternalPorts.Network.Ethernet.toString(
        SpeedRef.current!.value as ExternalPorts.Network.Ethernet.Speed,
        InterfaceRef.current!.value as ExternalPorts.Network.Ethernet.Interface
      ));

    return (
      <>
        <OptionSelect
          ref={SpeedRef}
          options={ExternalPorts.Network.Ethernet.Speed.options}
          defaultValue={ExternalPorts.Network.Ethernet.Speed.options[0]}
          onChange={onChange}
          required
        />
        <OptionSelect
          ref={InterfaceRef}
          options={ExternalPorts.Network.Ethernet.Interface.options}
          defaultValue={ExternalPorts.Network.Ethernet.Interface.options[0]}
          onChange={onChange}
          required
        />
        {" LAN Ethernet"}
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
};

const PeripheralInputFields: Record<
  ExternalPorts.Peripheral.Type,
  FunctionComponent<{ ref: RefObject<HTMLInputElement | null> }>
> = {
  USB: ({ ref }) => {
    const GenerationInput = useRef<HTMLSelectElement>(null);
    const ConnectorInput = useRef<HTMLSelectElement>(null);

    const defaultValue = ExternalPorts.Peripheral.USB.toString(
      ExternalPorts.Peripheral.USB.Generation.options[0],
      ExternalPorts.Peripheral.USB.Connector.options[0]
    );
    const onChange = () =>
      (ref.current!.value = ExternalPorts.Peripheral.USB.toString(
        GenerationInput.current!
          .value as ExternalPorts.Peripheral.USB.Generation,
        ConnectorInput.current!.value as ExternalPorts.Peripheral.USB.Connector
      ));

    return (
      <>
        <OptionSelect
          ref={GenerationInput}
          options={ExternalPorts.Peripheral.USB.Generation.options}
          defaultValue={ExternalPorts.Peripheral.USB.Generation.options[0]}
          onChange={onChange}
          required
        />
        <OptionSelect
          ref={ConnectorInput}
          options={ExternalPorts.Peripheral.USB.Connector.options}
          defaultValue={ExternalPorts.Peripheral.USB.Connector.options[0]}
          onChange={onChange}
          required
        />
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
  "PS/2": ({ ref }) => {
    const defaultValue = ExternalPorts.Peripheral.PS2.toString(
      ExternalPorts.Peripheral.PS2.Port.options[0]
    );
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
      (ref.current!.value = ExternalPorts.Peripheral.PS2.toString(
        e.target.value as ExternalPorts.Peripheral.PS2.Port
      ));

    return (
      <>
        <OptionSelect
          options={ExternalPorts.Peripheral.PS2.Port.options}
          defaultValue={ExternalPorts.Peripheral.PS2.Port.options[0]}
          onChange={onChange}
          required
        />
        {" PS/2"}
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
};

const DisplayInputFields: Record<
  ExternalPorts.Display.Type,
  FunctionComponent<{ ref: RefObject<HTMLInputElement | null> }>
> = {
  HDMI: ({ ref }) => {
    const VersionRef = useRef<HTMLSelectElement>(null);
    const ConnectorRef = useRef<HTMLSelectElement>(null);

    const defaultValue = ExternalPorts.Display.HDMI.toString(
      ExternalPorts.Display.HDMI.Version.options[0],
      ExternalPorts.Display.HDMI.Connector.options[0]
    );
    const onChange = () =>
      (ref.current!.value = ExternalPorts.Display.HDMI.toString(
        VersionRef.current!.value as ExternalPorts.Display.HDMI.Version,
        ConnectorRef.current!.value as ExternalPorts.Display.HDMI.Connector
      ));

    return (
      <>
        {"HDMI "}
        <OptionSelect
          ref={VersionRef}
          options={ExternalPorts.Display.HDMI.Version.options}
          defaultValue={ExternalPorts.Display.HDMI.Version.options[0]}
          onChange={onChange}
          required
        />
        <OptionSelect
          ref={ConnectorRef}
          options={ExternalPorts.Display.HDMI.Connector.options}
          defaultValue={ExternalPorts.Display.HDMI.Connector.options[0]}
          onChange={onChange}
          required
        />
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
  DisplayPort: ({ ref }) => {
    const defaultValue = ExternalPorts.Display.DisplayPort.toString(
      ExternalPorts.Display.DisplayPort.Version.options[0]
    );
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
      (ref.current!.value = ExternalPorts.Display.DisplayPort.toString(
        e.target.value as ExternalPorts.Display.DisplayPort.Version
      ));

    return (
      <>
        {"DisplayPort "}
        <OptionSelect
          options={ExternalPorts.Display.DisplayPort.Version.options}
          defaultValue={ExternalPorts.Display.DisplayPort.Version.options[0]}
          onChange={onChange}
          required
        />
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
  DVI: ({ ref }) => (
    <>
      <OptionSelect
        options={ExternalPorts.Display.DVI.options}
        defaultValue={ExternalPorts.Display.DVI.options[0]}
        onChange={(e) => (ref.current!.value = e.target.value)}
        required
      />
      <Input
        type="hidden"
        ref={ref}
        value={ExternalPorts.Display.DVI.options[0]}
      />
    </>
  ),
  VGA: ({ ref }) => (
    <>
      <OptionSelect
        options={ExternalPorts.Display.VGA.options}
        defaultValue={ExternalPorts.Display.VGA.options[0]}
        onChange={(e) => (ref.current!.value = e.target.value)}
        required
      />
      <Input
        type="hidden"
        ref={ref}
        value={ExternalPorts.Display.VGA.options[0]}
      />
    </>
  ),
};

const AudioInputFields: Record<
  ExternalPorts.Audio.Type,
  FunctionComponent<{ ref: RefObject<HTMLInputElement | null> }>
> = {
  "HD Audio": ({ ref }) => {
    const defaultValue = ExternalPorts.Audio.HDAudio.toString(
      ExternalPorts.Audio.HDAudio.Port.options[0]
    );
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
      (ref.current!.value = ExternalPorts.Audio.HDAudio.toString(
        e.target.value as ExternalPorts.Audio.HDAudio.Port
      ));

    return (
      <>
        <OptionSelect
          options={ExternalPorts.Audio.HDAudio.Port.options}
          defaultValue={ExternalPorts.Audio.HDAudio.Port.options[0]}
          onChange={onChange}
          required
        />
        {" HD Audio Port"}
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
  SPDIF: ({ ref }) => {
    const defaultValue = ExternalPorts.Audio.SPDIF.toString(
      ExternalPorts.Audio.SPDIF.Interface.options[0]
    );
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
      (ref.current!.value = ExternalPorts.Audio.SPDIF.toString(
        e.target.value as ExternalPorts.Audio.SPDIF.Interface
      ));

    return (
      <>
        <OptionSelect
          options={ExternalPorts.Audio.SPDIF.Interface.options}
          defaultValue={ExternalPorts.Audio.SPDIF.Interface.options[0]}
          onChange={onChange}
          required
        />
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
};

const InteractionInputField: Record<
  ExternalPorts.Interaction.Type,
  FunctionComponent<{ ref: RefObject<HTMLInputElement | null> }>
> = {
  Button: ({ ref }) => {
    const defaultValue = ExternalPorts.Interaction.Button.options[0];
    const onChange: ChangeEventHandler<HTMLSelectElement> = (e) =>
      (ref.current!.value = e.target.value as ExternalPorts.Interaction.Button);

    return (
      <>
        <OptionSelect
          options={ExternalPorts.Interaction.Button.options}
          defaultValue={defaultValue}
          onChange={onChange}
          required
        />
        <Input type="hidden" ref={ref} value={defaultValue} />
      </>
    );
  },
};

export const PortInputFields = {
  ...NetworkInputFields,
  ...PeripheralInputFields,
  ...DisplayInputFields,
  ...AudioInputFields,
  ...InteractionInputField,
} as const;
