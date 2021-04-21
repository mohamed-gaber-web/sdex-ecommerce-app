export class CheckoutModel {

        firstName: string;
        lastName: string;
        phone: string;
        landline: string;
        area: string;
        streetName: string;
        buildingName: string;
        floorNumber: 0;
        apartmentNumber: 0;
        nearestLandmark: string;
        locationType: string;
        cityName: string;
        note: string;
        paymentMethodId: 0;
        cartItems: [
          {
            productId:number;
            quantity: number;
          }
        ]
}