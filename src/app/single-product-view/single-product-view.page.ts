import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { TranslateService } from "@ngx-translate/core";
import { tap } from "rxjs/operators";
import { CartItem } from "../shared/models/cartItem";
import { Product } from "../shared/models/product";
import { ProductsService } from "../shared/services/products.service";
import { StorageService } from "../shared/services/storage.service";

@Component({
  selector: "app-single-product-view",
  templateUrl: "./single-product-view.page.html",
  styleUrls: ["./single-product-view.page.scss"],
})
export class SingleProductViewPage implements OnInit {
  private sub: any;
  cartListStorage: CartItem[];
  id: number;
  is_fav = false;
  public product: Product;
  public image: any;
  public zoomImage: any;
  count: number = 1;
  constructor(
    public toastController: ToastController,
    public productsService: ProductsService,
    public activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    public router:Router,
    private storageService: StorageService
  ) {}

  relatedProducts = [
    {
      product_id: 1,
      productImage: "../../../assets/products/iphone-12-pro-blue-150x150.png",
      productName: "Apple iPhone 12 32GB",
      brand: "Apple",
      shortName: "iPhone 12 32GB",
      off: 45,
      productLongDescription:
        "A14 Bionic, the fastest chip in a smartphone. An edge-to-edge OLED display. Ceramic Shield with four times better drop performance. And Night mode on every camera. iPhone 12 has it all — in two perfect sizes.",
      productShortDescription:
        "A14 Bionic, the fastest chip in a smartphone. An edge-to-edge OLED display.",
      regularPrice: 69000,
      salesPrice: 69900,
    },
    {
      product_id: 2,
      productImage: "../../../assets/products/iphone-12-mini-hero-150x150.jpeg",
      productName: "Apple iPhone 12 Pro  64GB",
      brand: "Apple",
      off: 45,
      shortName: "iPhone 12 Pro 64GB",
      productLongDescription:
        "A14 Bionic rockets past every other smartphone chip. The Pro camera system takes low-light photography to the next level — with an even bigger jump on iPhone 12 Pro Max. And Ceramic Shield delivers four times better drop performance. Let’s see what this thing can do.",
      productShortDescription:
        "A14 Bionic rockets past every other smartphone chip.",
      regularPrice: 199000,
      salesPrice: 119000,
    },
    {
      product_id: 3,
      productImage:
        "../../../assets/products/iPhone-SE-2020-Red.jpg?resize=150%2C150&ssl=1",
      productName: "Apple iPhone SE 32GB",
      brand: "Apple",
      off: 53,
      shortName: "iPhone SE 32GB",
      productLongDescription:
        "iPhone SE packs a remarkably powerful chip into our most popular size at our most affordable price. It’s just what you’ve been waiting for.",
      productShortDescription:
        "iPhone SE packs a remarkably powerful chip into our most popular size at our most affordable price. ",
      regularPrice: 39000,
      salesPrice: 39000,
    },
    {
      product_id: 4,
      productImage:
        "../../../assets/products/APPLE-IPHONE-11-PRO-MAX-Midnight-Green-CellucityPhoneHub-150x150.png",
      productName: "Apple iPhone 11 32GB",
      brand: "Apple",
      off: 25,
      shortName: "iPhone 11 32GB",
      productLongDescription:
        "As part of our efforts to reach our environmental goals, iPhone 11 does not include a power adapter or EarPods. Included in the box is a USB‑C to Lightning cable that supports fast charging and is compatible with USB‑C power adapters and computer ports.",
      productShortDescription:
        "As part of our efforts to reach our environmental goals, iPhone 11 does not include a power adapter or EarPods.",
      regularPrice: 54000,
      salesPrice: 50490,
    },
    {
      product_id: 5,
      productImage:
        "../../../assets/products/apple-macbook-pro-silver-7-150x150.jpg",
      productName: "iMac Intel Xeon 8GB 4K Retina",
      brand: "Apple",
      off: 45,
      shortName: "Apple iMac",
      productLongDescription:
        "The all-in-one for all. If you can dream it, you can do it on iMac. It’s beautifully designed, incredibly intuitive and packed with powerful tools that let you take any idea to the next level. And the new 27-inch model elevates the experience in every way, with faster processors and graphics, expanded memory and storage, enhanced audio and video capabilities, and an even more stunning Retina 5K display. It’s the desktop that does it all — better and faster than ever.",
      productShortDescription:
        "The all-in-one for all. If you can dream it, you can do it on iMac.",
      regularPrice: 99000,
      salesPrice: 99900,
    },
    {
      product_id: 6,
      productImage: "../../../assets/products/Apple-MacBook-Air-150x150.png",
      productName: "Apple MacBook Air 128GB SSD",
      brand: "Apple",
      off: 15,
      shortName: "MacBook Air",
      productLongDescription:
        "The incredibly thin and light MacBook Air is now more powerful than ever. It features a brilliant Retina display, new Magic Keyboard, Touch ID, processors with up to twice the performance,1 faster graphics and double the storage capacity. The sleek wedge-shaped design is created from 100% recycled aluminium, making it the greenest Mac ever.2 And with all-day battery life, our most popular Mac is your perfectly portable, do-it-all notebook.",
      productShortDescription:
        "The incredibly thin and light MacBook Air is now more powerful than ever.",
      regularPrice: 99090,
      salesPrice: 92900,
    },
    {
      product_id: 7,
      productImage:
        "../../../assets/products/apple-macbook-pro-silver-7-150x150.jpg",
      productName: "Apple MacBook Pro 512GB SSD",
      brand: "Apple",
      off: 22,
      shortName: "MacBook Pro",
      productLongDescription:
        "MacBook Pro elevates the notebook to a whole new level of performance and portability. Wherever your ideas take you, you’ll get there faster than ever with high‑performance processors and memory, advanced graphics, blazing‑fast storage and more — all in a compact 1.4-kilogram package.",
      productShortDescription:
        "MacBook Pro elevates the notebook to a whole new level of performance and portability.",
      regularPrice: 199000,
      salesPrice: 199000,
    },
  ];

  ngOnInit() {
    this.sub = this.activatedRoute.data.subscribe(
      (productId) => (this.id = +productId["id"])
    );

    // this.getRelatedProducts();
    this.getProductById(this.id);

    this.sub = this.translate.onLangChange
      .pipe(
        tap((res: any) => {
          const flag = this.storageService.getFlag(res.lang);
          this.storageService.setLanguage(flag);
          this.getProductById(this.id);
          location.reload();
        })
      )
      .subscribe();
  }

  async toastAlertDanger(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "danger",
    });
    toast.present();
  }

  async toastAlertCartSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      color: "success",
      buttons: [
        {
          side: "end",
          icon: "cart",
          text: "cart",
          handler: () => {
            this.router.navigate(['/tabs/tab3'])
          },
        },
      ],
    });
    toast.present();
  }
  addFav() {
    if (this.is_fav == false) {
      this.is_fav = true;
      this.toastAlertCartSuccess("Item added to wishlist.");
    } else {
      this.is_fav = false;
      this.toastAlertDanger("Item removed from wishlist.");
    }
  }

  public getProductById(id: number) {
    this.activatedRoute.data.subscribe((data) => {
      this.product = data.productResolve["result"];
      data.productResolve["result"].imagePaths.forEach((element) => {
        this.image = element;
      });
      data.productResolve["result"].imagePaths.forEach((elementZoom) => {
        this.zoomImage = elementZoom;
      });
      setTimeout(() => {
        //this.config.observer = true;
        // this.directiveRef.setIndex(0);
      });
    });
  }

  public addToCart() {
    this.cartListStorage = this.storageService.getCartItems();

    let currentProduct = this.cartListStorage.filter(
      (item) => item.id == this.product.id
    )[0];

    if (currentProduct) {
      if (currentProduct.amount + this.count <= this.product.quantity) {
        currentProduct.amount = currentProduct.amount + this.count;
        currentProduct.pricePerItem = this.product.priceAfterDiscount;
        this.toastAlertCartSuccess("Added Successfully");
      } else {
        this.toastAlertDanger(
          "You can not add more items than available. In stock ");
        return false;
      }
    } else {
      if (this.count <= this.product.quantity) {
        let c = new CartItem();
        c.id = this.product.id;
        c.title = this.product.productTranslations[0].title;
        c.amount = this.count;
        c.imagePath = this.product.imagePath;
        c.pricePerItem = this.product.priceAfterDiscount;
        c.stock =  this.product.quantity;
        this.cartListStorage.push(c);
        this.toastAlertCartSuccess("Added Successfully");
      } else {
        this.toastAlertDanger(
          "You can not add more items than available. In stock !"
        );
        return false;
      }
    }
    this.storageService.setCartItems(
      this.cartListStorage
    );
  }
}
