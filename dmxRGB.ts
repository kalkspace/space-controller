import { dmxnet as dmx } from "dmxnet";

export interface DMXRGBConfig {
  artnetip: string;
  channel: number;
  offsetRed: number;
  offsetGreen: number;
  offsetBlue: number;
  offsetDimmer?: number;
}

export default class DMXRGB {
  private config: DMXRGBConfig;
  private artnetClient: any;
  private static hexRegexp = new RegExp("^([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$");
  private color: [number, number, number] = [255, 255, 255];
  private brightness: number = 1;

  constructor(config: DMXRGBConfig) {
    this.config = config;
    const dmxnet = new dmx({});
    this.artnetClient = dmxnet.newSender({
      ip: config.artnetip
    });

    this.setBrightness(1);
  }

  setColor(hexColor: string) {
    const color = hexColor.toLowerCase();
    const matches = DMXRGB.hexRegexp.exec(color);
    if (matches === null) {
      return;
    }
    console.log(matches);

    let colorValues = matches.slice(1).map((hex: string) => parseInt(hex, 16)) as [
      number,
      number,
      number
    ];

    this.color = colorValues;
    if (!this.config.offsetDimmer) {
      colorValues = colorValues.map(color => color * this.brightness) as any;
    }
    this.setColorChannels(...colorValues);
  }

  setBrightness(brightness: number) {
    brightness = Math.max(0, Math.min(1, brightness));
    if ("offsetDimmer" in this.config) {
      this.artnetClient.setChannel(
        this.config.channel + this.config.offsetDimmer,
        Math.round(brightness * 255)
      );
      return;
    }

    const colors = this.color.map(value => value * brightness) as [
      number,
      number,
      number
    ];

    this.setColorChannels(...colors);
    this.brightness = brightness;
  }

  private setColorChannels(red: number, green: number, blue: number) {
    this.artnetClient.setChannel(this.config.channel + this.config.offsetRed, red);
    this.artnetClient.setChannel(this.config.channel + this.config.offsetGreen, green);
    this.artnetClient.setChannel(this.config.channel + this.config.offsetBlue, blue);
  }
}
