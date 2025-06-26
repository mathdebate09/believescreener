import * as React from "react"
import Svg, { Path } from "react-native-svg"
interface LogoProps {
  size: number | string;
  color: string;
}

const Logo = ({ size, color }: LogoProps) => (
  <Svg
    width={size}
    height={size}
    viewBox="0 0 810 810"
  >
    <Path
      fill={color}
      d="m230.348 636.012-56.364-56.367 405.563-405.567 56.367 56.367Zm0 0"
    />
    <Path fill={color} d="M118.152 444.852V365.14h573.555v79.71Zm0 0" />
    <Path
      fill={color}
      d="m165.969 235.781 55.035-57.664 414.91 396.004-55.035 57.664Zm0 0"
    />
    <Path fill={color} d="M365.145 118.152h79.71v573.559h-79.71Zm0 0" />
  </Svg>
)
export default Logo
