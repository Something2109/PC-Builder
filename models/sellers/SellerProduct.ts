import Validate from "../validate";

type APISellerProduct = {
  name?: string | null;
  price?: number | string | null;
  link?: string | null;
  img?: string | null;
  availability?: boolean | null;
};

class SellerProduct {
  name: string;
  price: number;
  link: string;
  img: string;
  availability: boolean;

  constructor({ name, price, link, img, availability }: APISellerProduct) {
    this.name = Validate.string(name);
    this.price = Validate.number(price);
    this.link = Validate.string(link);
    this.img = Validate.string(img);
    this.availability = Validate.boolean(availability);
  }
}

export { SellerProduct, type APISellerProduct };
