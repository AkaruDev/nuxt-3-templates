// import Hls from 'hls.js'
import { Ref, unref } from 'vue';
import { MuxVideo as MuxVideoType } from '../types/muxVideo';

interface UseMuxStreamProps {
  muxVideo: MuxVideoType | null;
  videoEl: Ref<HTMLVideoElement | null>;
  preferMp4?: boolean;
  useSmallResolution?: boolean;
}

export const useMuxStream = ({
  muxVideo,
  videoEl,
  preferMp4 = true,
  useSmallResolution = false,
}: UseMuxStreamProps) => {
  const video: MuxVideoType | null = unref(muxVideo);

  let stream = '';

  const appendVideo = (): void => {
    if (!video) return

    if (
      preferMp4 &&
      video.asset?.data?.static_renditions?.status === 'ready'
    ) {
      // create mp4 version
      const filesSortedByBitrate = [
        ...video?.asset?.data?.static_renditions?.files || [],
      ].sort((a, b) => b.bitrate - a.bitrate);
      const versionString = useSmallResolution
        ? filesSortedByBitrate[1]?.name
        : filesSortedByBitrate[0]?.name;
      stream = `https://stream.mux.com/${video.asset?.playbackId}/${versionString}`;
      if (videoEl.value) {
        videoEl.value.src = stream;
      }
    } else {
      // create hls version - uncomment and install hls lib to use it
      // stream = `https://stream.mux.com/${video.asset?.playbackId}.m3u8`
      // if (Hls.isSupported()) {
      //   const hls = new Hls();
      //   hls.loadSource(stream);
      //   hls.attachMedia(videoEl.value);
      // } else if (
      //   videoEl.value?.canPlayType('application/vnd.apple.mpegurl')
      // ) {
      //   videoEl.value.src = stream;
      // }
    }
  };

  return { appendVideo };
};
