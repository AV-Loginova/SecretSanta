import { Wishlist } from 'app/(pages)/wishlist/wishlist.types';
import { SubmitHandler } from 'react-hook-form';

export interface WishlistFormProps {
  onSubmit: SubmitHandler<Wishlist>;
}
