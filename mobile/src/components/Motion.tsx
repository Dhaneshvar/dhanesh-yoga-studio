import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Easing, Pressable, type PressableProps, StyleSheet, View } from "react-native";
import * as Haptics from "expo-haptics";
import { usePreferences } from "../contexts/PreferencesContext";

export function AnimatedEntrance({ children, delay = 0, distance = 12 }: { children: ReactNode; delay?: number; distance?: number }) {
  const { reduceMotion } = usePreferences();
  const opacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;
  const translate = useRef(new Animated.Value(reduceMotion ? 0 : distance)).current;
  useEffect(() => {
    if (reduceMotion) { opacity.setValue(1); translate.setValue(0); return; }
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 360, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.timing(translate, { toValue: 0, duration: 420, delay, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
    ]).start();
  }, [delay, opacity, reduceMotion, translate]);
  return <Animated.View style={{ opacity, transform: [{ translateY: translate }] }}>{children}</Animated.View>;
}

export function PulseMark({ children }: { children: ReactNode }) {
  const { reduceMotion } = usePreferences(); const scale = useRef(new Animated.Value(1)).current;
  useEffect(() => { if (reduceMotion) return; const loop = Animated.loop(Animated.sequence([Animated.timing(scale, { toValue: 1.06, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true }), Animated.timing(scale, { toValue: 1, duration: 850, easing: Easing.inOut(Easing.sin), useNativeDriver: true })])); loop.start(); return () => loop.stop(); }, [reduceMotion, scale]);
  return <Animated.View style={{ transform: [{ scale }] }}>{children}</Animated.View>;
}

export function MotionPressable({ children, onPress, haptic = true, style, ...props }: PressableProps & { children: ReactNode; haptic?: boolean }) {
  const { reduceMotion } = usePreferences(); const scale = useRef(new Animated.Value(1)).current;
  const animate = (toValue: number) => { if (reduceMotion) return; Animated.spring(scale, { toValue, speed: 30, bounciness: 3, useNativeDriver: true }).start(); };
  return <Animated.View style={{ transform: [{ scale }] }}><Pressable {...props} onPressIn={(event) => { animate(0.975); props.onPressIn?.(event); }} onPressOut={(event) => { animate(1); props.onPressOut?.(event); }} onPress={(event) => { if (haptic) void Haptics.selectionAsync(); onPress?.(event); }} style={style}>{children}</Pressable></Animated.View>;
}

export function StaggeredListItem({ children, index }: { children: ReactNode; index: number }) { return <AnimatedEntrance delay={Math.min(index, 8) * 45}><View style={styles.item}>{children}</View></AnimatedEntrance>; }
const styles = StyleSheet.create({ item: { width: "100%" } });
