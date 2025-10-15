import { User, WishlistItem } from '@prisma/client';

export type UserWithWishlist = User & {
  wishlist: WishlistItem[];
};
