
interface VimeoFile {
  quality: string;
  rendition: string;
  type: string;
  width: number;
  height: number;
  link: string;
  created_time: string;
  fps: number;
  size: number;
  md5: string | null;
  public_name: string;
  size_short: string;
}

interface VimeoPicture {
  width: number;
  height: number;
  link: string;
  link_with_play_button: string;
}

export interface VimeoVideo {
  title: string;
  width: number;
  height: number;
  files: VimeoFile[];
  pictures: VimeoPicture[];
}
