import { planetMedia, planetStatic } from './planetMedia'

export const SUN_AIGC_VIDEO =
  import.meta.env.VITE_SUN_AIGC_VIDEO || planetMedia('aigc作品.mp4')
export const VENUS_PORTFOLIO_VIDEO =
  import.meta.env.VITE_VENUS_PORTFOLIO_VIDEO || planetMedia('作品集.mp4')
export const SCHOLARSHIP_IMAGE = planetStatic('国家奖学金.jpg')

export const AWARD_SLIDESHOW = [
  '参赛奖状/飞身上篮技能赛一等奖.png',
  '参赛奖状/飞身上篮竞技赛二等奖.png',
  '参赛奖状/飞身上篮传球赛二等奖.png',
  '参赛奖状/飞身上篮全能奖.png',
  '参赛奖状/足式竞赛竞速赛三等奖.png',
  '参赛奖状/足式竞赛越野赛三等奖.png',
  '参赛奖状/2024嵌入式南部一等奖.jpg',
  '参赛奖状/2024嵌入式全国三等奖.jpg',
  '参赛奖状/2025年5月26日蓝桥杯嵌入式省三.jpg',
  '参赛奖状/中国国际大学生创新大赛.png',
  '参赛奖状/“菱朗杯”第九届广东省汽车与农机电子环保大赛广东省三等奖.png',
  '参赛奖状/华为认证证书.png',
  '参赛奖状/学生助理.jpg',
].map(planetStatic)
