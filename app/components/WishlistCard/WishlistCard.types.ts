import { WishlistItemType } from 'app/(pages)/wishlist/wishlist.types';

export interface WishlistCardProps {
  item: WishlistItemType;
  onDelete?: (id: number) => Promise<void>;
  onEdit?: (id: number, data: Partial<WishlistItemType>) => Promise<void>;
}
