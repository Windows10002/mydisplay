import PixelSolarCanvas from '../PixelSolarCanvas'
import RangerHud from './RangerHud'

/** 左舱 · 像素太阳系实时画面（静态展示，无交互热点） */
export default function SolarSystemViewport() {
  return (
    <div className="solar-viewport">
      <div className="console__viewport solar-viewport__canvas-wrap">
        <PixelSolarCanvas mode="console" />
        <RangerHud />
      </div>
      <p className="console__viewport-cta">
        <span className="console__viewport-cta-tag">实时</span>
        像素太阳系遥测画面
      </p>
    </div>
  )
}
