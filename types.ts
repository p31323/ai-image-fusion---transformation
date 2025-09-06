export enum AppMode {
  MERGE = 'MERGE',
  EDIT = 'EDIT',
}

export enum ArtStyle {
    PHOTOREALISTIC = 'photorealistic',
    ANIME = 'anime',
    WATERCOLOR = 'watercolor',
    CYBERPUNK = 'cyberpunk',
    FANTASY = 'fantasy',
    THREED = '3d_model',
    PIXEL = 'pixel_art',
    SUPERMAN_COMIC = 'superman_comic',
    SPONGEBOB = 'spongebob',
    GHIBLI = 'ghibli',
    ONE_PIECE = 'one_piece',
}

export type Language = 'en' | 'zh' | 'ja';

export interface Translations {
  [key: string]: string;
}