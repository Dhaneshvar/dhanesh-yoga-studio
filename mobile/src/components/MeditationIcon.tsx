import Svg, { Circle, Path } from "react-native-svg";

type MeditationIconProps = { size?: number; color?: string };

/** Native counterpart of the web guided-meditation silhouette. */
export const MeditationIcon = ({ size = 28, color = "#16b9aa" }: MeditationIconProps) => (
  <Svg width={size} height={size} viewBox="0 0 64 64" fill="none" accessibilityLabel="Guided meditation">
    <Path d="M32 8c-5.5 6-5.5 13.5 0 18 5.5-4.5 5.5-12 0-18Z" fill={color} opacity={0.36} />
    <Circle cx="32" cy="21" r="5" fill={color} />
    <Path d="M23 38c1.7-9 5-13 9-13s7.3 4 9 13l5.4 4.1c-3.4 3-8 4.7-14.4 4.7s-11-1.7-14.4-4.7L23 38Z" fill={color} />
    <Path d="M32 36c-4.9 7.6-11.8 10.8-20.7 9.5 3.2 7.1 10.1 10.5 20.7 10.5s17.5-3.4 20.7-10.5C43.8 46.8 36.9 43.6 32 36Z" fill={color} opacity={0.8} />
    <Path d="M12 51c5.5-1.6 10.7-1.1 15.5 1.6M52 51c-5.5-1.6-10.7-1.1-15.5 1.6" stroke={color} strokeWidth="3" strokeLinecap="round" />
    <Path d="M20 15c-3.8 1.2-6.6 3.5-8.4 7M44 15c3.8 1.2 6.6 3.5 8.4 7" stroke={color} strokeWidth="3" strokeLinecap="round" opacity={0.7} />
  </Svg>
);

export default MeditationIcon;
