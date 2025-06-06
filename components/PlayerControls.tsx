import React, { useCallback, ComponentProps } from "react";
import { Colors } from "@/constants/Colors";
import {
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";
import TrackPlayer, {
  useIsPlaying,
  RepeatMode,
  useActiveTrack,
} from "react-native-track-player";
import { useRouter } from "expo-router";
import { downloadAndSaveSong } from "@/services/download";
import { useTrackPlayerRepeatMode } from "@/hooks/useTrackPlayerRepeatMode";
import { match } from "ts-pattern";
import { useIsSongDownloaded } from "@/store/library";
import { moderateScale } from "react-native-size-matters/extend";

type PlayerControlsProps = {
  style?: ViewStyle;
};

type PlayerButtonProps = {
  style?: ViewStyle;
  iconSize?: number;
};

export const PlayerControls = ({ style }: PlayerControlsProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <AddToPlaylistButton />

        <SkipToPreviousButton />

        <PlayPauseButton />

        <SkipToNextButton />

        <RepeatToggle />
      </View>
    </View>
  );
};

export const ReducedPlayerControls = ({ style }: PlayerControlsProps) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.row}>
        <SkipToPreviousButton />

        <PlayPauseButton />

        <SkipToNextButton />
      </View>
    </View>
  );
};

export const PlayPauseButton = ({
  style,
  iconSize = moderateScale(50),
}: PlayerButtonProps) => {
  const { playing } = useIsPlaying();

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={playing ? TrackPlayer.pause : TrackPlayer.play}
      >
        <FontAwesome6
          name={playing ? "pause" : "play"}
          size={iconSize}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export const SkipToNextButton = ({
  iconSize = moderateScale(40),
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => TrackPlayer.skipToNext()}
    >
      <Entypo name="controller-next" size={iconSize} color={Colors.text} />
    </TouchableOpacity>
  );
};

export const SkipToPreviousButton = ({
  iconSize = moderateScale(40),
}: PlayerButtonProps) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => TrackPlayer.skipToPrevious()}
    >
      <Entypo
        name="controller-jump-to-start"
        size={iconSize}
        color={Colors.text}
      />
    </TouchableOpacity>
  );
};

export const AddToPlaylistButton = ({ iconSize = moderateScale(30) }) => {
  const router = useRouter();

  return (
    <View>
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => router.push({ pathname: "/(modals)/addToPlaylist" })}
      >
        <MaterialIcons
          name="playlist-add"
          size={iconSize}
          color={Colors.text}
        />
      </TouchableOpacity>
    </View>
  );
};

export const DownloadSongButton = ({
  style,
  iconSize = moderateScale(27),
}: PlayerButtonProps) => {
  const activeTrack = useActiveTrack();
  const downloaded = useIsSongDownloaded(activeTrack?.id || "");

  const handleDownload = useCallback(async () => {
    if (!activeTrack || downloaded) return;

    await downloadAndSaveSong({
      id: activeTrack.id,
      title: activeTrack.title || "Unknown Title",
      artist: activeTrack.artist || "Unknown Artist",
      duration: activeTrack.duration,
      url: activeTrack.url,
      thumbnailUrl: activeTrack.artwork,
    });

    // no local setState—Redux update will re-render this hook
  }, [activeTrack, downloaded]);

  return (
    <View style={[{ height: iconSize }, style]}>
      <TouchableOpacity activeOpacity={0.5} onPress={handleDownload}>
        <MaterialIcons
          name={downloaded ? "download-done" : "download"}
          size={iconSize}
          color={downloaded ? "white" : Colors.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

type RepeatIconProps = Omit<
  ComponentProps<typeof MaterialCommunityIcons>,
  "name"
>;
type RepeatIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

const repeatOrder = [
  RepeatMode.Off,
  RepeatMode.Track,
  RepeatMode.Queue,
] as const;

export const RepeatToggle = ({ ...iconProps }: RepeatIconProps) => {
  const { repeatMode, changeRepeatMode } = useTrackPlayerRepeatMode();

  const toggleRepeatMode = () => {
    if (repeatMode == null) return;

    const currentIndex = repeatOrder.indexOf(repeatMode);
    const nextIndex = (currentIndex + 1) % repeatOrder.length;

    changeRepeatMode(repeatOrder[nextIndex]);
  };

  const icon = match(repeatMode)
    .returnType<RepeatIconName>()
    .with(RepeatMode.Off, () => "repeat-off")
    .with(RepeatMode.Track, () => "repeat-once")
    .with(RepeatMode.Queue, () => "repeat")
    .otherwise(() => "repeat-off");

  return (
    <MaterialCommunityIcons
      name={icon}
      onPress={toggleRepeatMode}
      color={Colors.text}
      size={moderateScale(32)}
      {...iconProps}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});
