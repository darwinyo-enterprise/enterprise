export interface ManufacturerModel {
  /** guid based. */
  id: string;
  name: string;
  description: string;
  /** generated in backend code. */
  imageUrl: string;
  /** used for create and update only */
  image: File;
}
