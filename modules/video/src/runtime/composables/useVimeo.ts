import { Ref, unref } from 'vue';
import { VimeoFile as VimeoFileType } from '../types/vimeoVideo';

interface UseVimeoProps {
  videoVimeo: VimeoFileType[] | null
  videoEl: Ref<HTMLVideoElement | null>;
  useSmallResolution?: boolean;
}

export const useVimeo = ({
  videoVimeo,
  videoEl,
  useSmallResolution = false,
}: UseVimeoProps) => {
  const video: VimeoFileType[] | null = unref(videoVimeo);

  const appendVideo = (): void => {
    if (!video) return
    const renditions: string[] = ['540p', '720p', '1080p'];
    const allRenditionsAvailable: boolean = renditions.every((rendition) =>
      video.some((video: VimeoFileType) => video.rendition === rendition)
    );

    if (useSmallResolution && allRenditionsAvailable) {
      if (window.innerWidth < 720) {
        videoEl.value!.src = video.find((video: VimeoFileType) => video.rendition === '540p')?.link || '';
      } else if (window.innerWidth < 1240) {
        videoEl.value!.src = video.find((video: VimeoFileType) => video.rendition === '720p')?.link || '';
      } else {
        videoEl.value!.src = video.find((video: VimeoFileType) => video.rendition === '1080p')?.link || '';
      }
    } else {
      videoEl.value!.src = video.find((video: VimeoFileType) => video.rendition === '1080p')?.link || '';
    }
  };

  return { appendVideo };
};
