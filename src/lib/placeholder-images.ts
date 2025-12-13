import data from './placeholder-images.json';

export type ImagePlaceholder = {
  id: string;
  description: string;
  imageUrl: string;
  imageHint: string;
};

// The type assertion here is important to ensure that the JSON data is correctly typed.
export const PlaceHolderImages: ImagePlaceholder[] = data.placeholderImages as ImagePlaceholder[];
