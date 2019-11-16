import DMXRGB from "./dmxRGB";

const light = new DMXRGB({
  artnetip: "10.1.0.50",
  channel: 0,
  offsetRed: 1,
  offsetGreen: 2,
  offsetBlue: 3,
  offsetDimmer: 0
});

const hexColors = ["2B2D42", "26408B", "016FB9", "EAEBED", "FF9505"];

light.setBrightness(1);

setInterval(
  () => light.setColor(hexColors[Math.floor(Math.random() * hexColors.length)]),
  100
);
