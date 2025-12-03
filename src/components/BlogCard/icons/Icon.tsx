import EyeIcon from './EyeIcon'
import HeartIcon from './HeartIcon'
import CommentIcon from './CommentIcon'

const iconMap = {
  eye: EyeIcon,
  heart: HeartIcon,
  comment: CommentIcon,
} as const

type IconName = keyof typeof iconMap

interface IconProps {
  name: IconName
}

export default function Icon({ name }: IconProps) {
  const IconComponent = iconMap[name]
  return <IconComponent />
}
