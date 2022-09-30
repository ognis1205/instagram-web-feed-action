/**
 * @fileoverview Defines instagram-web-api types.
 * @copyright Shingo OKAWA 2022
 */
declare module 'instagram-web-api' {
  class Instagram {
    constructor({ username: string });
    async getPhotosByUsername({ username: string }): Feed;
  }

  export type Node = {
    __typename: string;
    id: string;
    dimensions: {
      height: number;
      width: number;
    };
    display_url: string;
    display_resources: {
      src: string;
      config_width: number;
      config_height: number;
    }[];
    is_video: boolean;
    should_log_client_event: boolean;
    tracking_token: string;
    edge_sidecar_to_children: EdgeSideCar;
    edge_media_to_tagged_user: {
      edges: [];
    };
    edge_media_to_caption: {
      edges: {
        node: {
          text: string;
        };
      }[];
    };
    shortcode: string;
    edge_media_to_comment: {
      count: number;
      page_info: {
        has_next_page: boolean;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        end_cursor: any;
      };
      edges: [];
    };
    comments_disabled: boolean;
    taken_at_timestamp: number;
    edge_media_preview_like: {
      count: number;
    };
    gating_info: null;
    media_preview: string;
    owner: {
      id: string;
    };
    thumbnail_src: string;
    thumbnail_resources: {
      src: string;
      config_width: number;
      config_height: number;
    }[];
    video_url: string;
  };

  export type Edge = {
    node: Node;
  };

  export type EdgeSideCar = {
    edges: Edge[];
//    {
//      node: Node[];
//    };
  };

  export type EdgeOwnerToTimelineMedia = {
    count: number;
    page_info: {
      has_next_page: boolean;
      end_cursor: string;
    };
    edges: Edge[];
  };
  
  export type Feed = {
    user: {
      edge_owner_to_timeline_media: EdgeOwnerToTimelineMedia;
    };
  };

  export = Instagram;
}
