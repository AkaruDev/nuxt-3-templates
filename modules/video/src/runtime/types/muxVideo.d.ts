interface MuxVideoTrack {
  max_frame_rate: number;
  max_height: number;
  id: string;
  type: string;
  duration: number;
  max_width: number;
}

interface MuxVideoFile {
  ext: string;
  name: string;
  width: number;
  bitrate: number;
  filesize: string;
  height?: number;
}

interface MuxVideoStaticRenditions {
  files: MuxVideoFile[];
  status: string;
}

interface MuxVideoData {
  playback_ids: { id: string; policy: string }[];
  encoding_tier: string;
  id: string;
  created_at: string;
  status: string;
  upload_id: string;
  duration: number;
  max_resolution_tier: string;
  max_stored_resolution: string;
  ingest_type: string;
  static_renditions: MuxVideoStaticRenditions;
  passthrough: string;
  max_stored_frame_rate: number;
  resolution_tier: string;
  master_access: string;
  aspect_ratio: string;
  tracks: MuxVideoTrack[];
  mp4_support: string;
}

export interface MuxVideoAsset {
  status: string;
  playbackId: string;
  data: MuxVideoData;
  assetId: string;
  _createdAt: string;
  _rev: string;
  _type: string;
  uploadId: string;
  _id: string;
  _updatedAt: string;
  thumbTime?: number
}

export interface MuxVideo {
  _type: string;
  asset: MuxVideoAsset;
}
