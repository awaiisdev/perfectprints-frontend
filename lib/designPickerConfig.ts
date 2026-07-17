// 14 August Design Picker — design metadata
// Coordinates are in the ORIGINAL image's pixel space (see width/height).
// shape: "circle" | "oval" | "rounded_rect" | "rect"
export type DesignShape = "circle" | "oval" | "rounded_rect" | "rect";
export type DesignType = "photo_only" | "name_only" | "both";

export interface DesignDef {
  id: string;
  file: string;       // full-res image path (public/)
  thumb: string;       // gallery thumbnail path (public/)
  w: number;
  h: number;
  type: DesignType;
  shape: DesignShape;
  x: number; y: number; pw: number; ph: number; // photo box
  nx?: number; ny?: number; nw?: number; nh?: number; color?: string; // name box
}

const BASE = "/designs/14-august";

export const DESIGN_LIST: DesignDef[] = [
  { id: "design01", file: `${BASE}/design01.jpg`, thumb: `${BASE}/design01-thumb.jpg`, w: 2250, h: 3150, type: "photo_only", shape: "circle", x: 645, y: 850, pw: 850, ph: 850 },
  { id: "design02", file: `${BASE}/design02.jpg`, thumb: `${BASE}/design02-thumb.jpg`, w: 2250, h: 3150, type: "both", shape: "oval", x: 620, y: 830, pw: 1090, ph: 1250, nx: 700, ny: 2210, nw: 970, nh: 220, color: "#1a3d1a" },
  { id: "design04", file: `${BASE}/design04.jpg`, thumb: `${BASE}/design04-thumb.jpg`, w: 2250, h: 3150, type: "photo_only", shape: "oval", x: 655, y: 910, pw: 910, ph: 1030 },
  { id: "design14", file: `${BASE}/design14.jpg`, thumb: `${BASE}/design14-thumb.jpg`, w: 2250, h: 3150, type: "both", shape: "oval", x: 680, y: 845, pw: 785, ph: 1120, nx: 700, ny: 2775, nw: 770, nh: 160, color: "#2a5a2a" },
  { id: "design07", file: `${BASE}/design07.jpg`, thumb: `${BASE}/design07-thumb.jpg`, w: 2250, h: 3150, type: "photo_only", shape: "rounded_rect", x: 700, y: 710, pw: 850, ph: 1260 },
  { id: "design09", file: `${BASE}/design09.jpg`, thumb: `${BASE}/design09-thumb.jpg`, w: 2480, h: 3508, type: "both", shape: "rounded_rect", x: 360, y: 1620, pw: 1770, ph: 1365, nx: 540, ny: 3045, nw: 1410, nh: 245, color: "#5a3a1a" },
  { id: "design16", file: `${BASE}/design16.jpg`, thumb: `${BASE}/design16-thumb.jpg`, w: 2400, h: 3000, type: "photo_only", shape: "oval", x: 775, y: 930, pw: 1095, ph: 1085 },
  { id: "design20", file: `${BASE}/design20.jpg`, thumb: `${BASE}/design20-thumb.jpg`, w: 2250, h: 3150, type: "both", shape: "rounded_rect", x: 330, y: 1455, pw: 1600, ph: 1230, nx: 490, ny: 2745, nw: 1280, nh: 215, color: "#1a3d1a" },
  { id: "design22", file: `${BASE}/design22.jpg`, thumb: `${BASE}/design22-thumb.jpg`, w: 864, h: 1230, type: "photo_only", shape: "rounded_rect", x: 155, y: 268, pw: 565, ph: 805 },
  { id: "design26", file: `${BASE}/design26.jpg`, thumb: `${BASE}/design26-thumb.jpg`, w: 864, h: 1232, type: "photo_only", shape: "rounded_rect", x: 180, y: 288, pw: 500, ph: 725 },
  { id: "design30", file: `${BASE}/design30.jpg`, thumb: `${BASE}/design30-thumb.jpg`, w: 880, h: 1214, type: "photo_only", shape: "rounded_rect", x: 222, y: 302, pw: 432, ph: 700 },
  { id: "design10", file: `${BASE}/design10.jpg`, thumb: `${BASE}/design10-thumb.jpg`, w: 2250, h: 3150, type: "photo_only", shape: "rounded_rect", x: 1150, y: 1614, pw: 1051, ph: 804 },
  { id: "design21", file: `${BASE}/design21.jpg`, thumb: `${BASE}/design21-thumb.jpg`, w: 2250, h: 3150, type: "both", shape: "rect", x: 160, y: 176, pw: 1959, ph: 1608, nx: 540, ny: 2629, nw: 1156, nh: 295, color: "#0b4a2e" },
  { id: "design23", file: `${BASE}/design23.jpg`, thumb: `${BASE}/design23-thumb.jpg`, w: 864, h: 1215, type: "photo_only", shape: "rounded_rect", x: 194, y: 268, pw: 476, ph: 740 },
  { id: "design24", file: `${BASE}/design24.jpg`, thumb: `${BASE}/design24-thumb.jpg`, w: 848, h: 1231, type: "photo_only", shape: "rounded_rect", x: 180, y: 181, pw: 483, ph: 773 },
  { id: "design28", file: `${BASE}/design28.jpg`, thumb: `${BASE}/design28-thumb.jpg`, w: 864, h: 1226, type: "photo_only", shape: "rounded_rect", x: 145, y: 339, pw: 557, ph: 626 },
];