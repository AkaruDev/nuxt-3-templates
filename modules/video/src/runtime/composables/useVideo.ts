import { ref, onMounted, Ref } from 'vue';
import { useIntersectionObserver, useFullscreen } from '@vueuse/core';
import { VideoState as VideoStateType } from '../types/videoState';
import { Control } from '../components/AppVideoControls.vue';

interface UseVideoProps {
  refEl: Ref<HTMLElement | null>;
  refVideo: Ref<HTMLVideoElement | null>;
  muted: boolean;
  autoplay: boolean;
  loading: string;
  toggleCover: boolean;
  appendVideo?: () => void;
  emit: any;
}

export const useVideo = ({
  refEl,
  refVideo,
  muted,
  autoplay,
  loading,
  toggleCover,
  appendVideo,
  emit
}: UseVideoProps) => {
  const state = ref<VideoStateType>({
    muted,
    playing: autoplay,
    fullscreen: false,
    loaded: false
  });

  const isInit = ref<boolean>(false);
  const isInViewport = ref<boolean>(false);
  const isCoverHidden = ref<boolean>(false);
  const duration = ref<number>(0);
  const progress = ref<number>(0);

  onMounted(() => {
    if (loading === 'onMounted') {
      loadVideo();
    }
  });

  const loadVideo = () => {
    if (!isInit.value) {
      appendVideo?.();
      refVideo.value?.load();
      isInit.value = true;
    }
  };

  useIntersectionObserver(
    refVideo,
    ([{ isIntersecting }]) => {
      if (loading === 'lazy' && isIntersecting) {
        loadVideo();
      }

      if (autoplay) {
        if (isIntersecting) {
          isInViewport.value = true;
          play();
        } else {
          isInViewport.value = false;
          setTimeout(() => {
            pause();
          }, 100);
        }
      }
    },
    {
      threshold: 0
    }
  );

  const { toggle: toggleFullscreen } = useFullscreen(refEl);

  const onControlsChange = (control: Control) => {
    if (control?.togglePlayPause) {
      togglePlayPause();
    }
    if (control?.toggleMute) {
      if (state.value.muted) {
        unmute();
      } else {
        mute();
      }
    }
    if (control?.toggleFullscreen) {
      toggleFullscreen();
      state.value.fullscreen = !state.value.fullscreen;
    }
    if (control?.progress !== undefined) {
      setProgress(control.progress);
    }
  };

  const onTimeUpdate = () => {
    if (!refVideo.value || !duration.value) return;
    progress.value = refVideo.value.currentTime / duration.value;
    emit('onProgress', progress.value);
  };

  const onPlayPauseUpdate = (event: Event) => {
    const target = event.target as HTMLVideoElement;
    state.value.playing =
      !target.paused &&
      !target.ended &&
      target.readyState > target.HAVE_CURRENT_DATA;

    if (toggleCover === true) {
      isCoverHidden.value = state.value.playing;
    } else {
      isCoverHidden.value = isCoverHidden.value === false ? state.value.playing : isCoverHidden.value;
    }

    if (!state.value.loaded) {
      duration.value = refVideo.value?.duration || 0;
      state.value.loaded = true;
      emit('onLoaded');
    }
  };

  const togglePlayPause = () => {
    if (state.value.playing) {
      pause();
    } else {
      play();
    }
  };

  const play = () => {
    loadVideo();
    refVideo.value?.play();
    emit('onPlay');
  };

  const pause = () => {
    refVideo.value?.pause();
    emit('onPause');
  };

  const stop = () => {
    pause();
    setCurrentTime(0);
    emit('onStop');
  };

  const setCurrentTime = (time: number) => {
    refVideo.value!.currentTime = time;
  };

  const setProgress = (percent: number) => {
    setCurrentTime(percent * duration.value);
  };

  const mute = () => {
    state.value.muted = true;
    setVolume(0);
  };

  const unmute = () => {
    state.value.muted = false;
    setVolume(1);
  };

  const setVolume = (volume: number) => {
    refVideo.value!.volume = volume;
  };

  const promiseLoadVideo = (): Promise<HTMLVideoElement> => {
    return new Promise<HTMLVideoElement>((resolve, reject) => {
      const videoElement = refVideo.value;

      if (!videoElement) {
        reject(new Error('L\'élément vidéo est introuvable'));
        return;
      }

      if (videoElement.readyState >= 3) {
        resolve(videoElement);
      } else {
        const onCanPlayThrough = () => {
          videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
          videoElement.removeEventListener('error', onError);
          resolve(videoElement);
        };

        const onError = () => {
          videoElement.removeEventListener('canplaythrough', onCanPlayThrough);
          videoElement.removeEventListener('error', onError);
          reject(new Error('Erreur lors du chargement de la vidéo'));
        };

        videoElement.addEventListener('canplaythrough', onCanPlayThrough);
        videoElement.addEventListener('error', onError);

        loadVideo();
      }
    });
  };

  return {
    state,
    progress,
    duration,
    isCoverHidden,
    play,
    pause,
    stop,
    mute,
    unmute,
    setVolume,
    setCurrentTime,
    togglePlayPause,
    promiseLoadVideo,
    onControlsChange,
    onPlayPauseUpdate,
    onTimeUpdate,
  };
};
