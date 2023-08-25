import db from "../db.server.js";

export const createDiscount = async (graphql, data,shop) => {

  const { discountTitle, customerBuyProduct, customerGetProduct, customerGetProductName, customerBuyProductName, discountType, discountValue, discountEndDate, customerGetProductPrice, customerBuyProductPrice } = data.data

  let customersGetsQuery
  if (discountType.percentage) {
    customersGetsQuery = {
      "discountOnQuantity": {
        "quantity": "1",
        "effect": {
          "percentage": Number(discountValue) / 100
        }
      }
    }
  } else {
    customersGetsQuery = {
      "discountOnQuantity": {
        "quantity": "1",
        "effect": {
          "percentage": (Number(discountValue) / Number(customerGetProductPrice))
        }
      }
    }
  }

  try {
    const response = await graphql(
      `mutation discountAutomaticBxgyCreate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!) {
                discountAutomaticBxgyCreate(automaticBxgyDiscount: $automaticBxgyDiscount) {
                  automaticDiscountNode {
                    id
                    automaticDiscount {
                      ... on DiscountAutomaticBxgy {
                        createdAt
                        startsAt
                        endsAt
                        status
                        summary
                        title
                        usesPerOrderLimit
                        customerGets {
                          items {
                            ... on DiscountProducts {
                              products(first: 2) {
                                nodes {
                                  id
                                }
                              }
                            }
                          }
                          value {
                            ... on DiscountOnQuantity {
                              quantity {
                                quantity
                              }
                            }
                          }
                        }
                        customerBuys {
                          items {
                            ... on DiscountProducts {
                              products(first: 2) {
                                nodes {
                                  id
                                }
                              }
                            }
                          }
                          value {
                            ... on DiscountQuantity {
                              quantity
                            }
                          }
                        }
                      }
                    }
                  }
                  userErrors {
                    field
                    code
                    message
                  }
                }
              }`,
      {
        variables: {
          "automaticBxgyDiscount": {
            "usesPerOrderLimit": "1",
            "startsAt": new Date().toISOString(),
            "endsAt": discountEndDate ? discountEndDate : null,
            "title": discountTitle,
            "customerGets": {
              "value": {
                ...customersGetsQuery
              },
              "items": {
                "products": {
                  "productVariantsToAdd": [
                    customerGetProduct
                  ]
                }
              }
            },
            "customerBuys": {
              "value": {
                "quantity": "1"
              },
              "items": {
                "products": {
                  "productVariantsToAdd": [
                    customerBuyProduct
                  ]
                }
              }
            }
          }
        },
      }
    )

    const data = await response.json();
    const errors = data.data.discountAutomaticBxgyCreate.userErrors
    if (!errors.length) {
      await db.discount.create({
        data: {
          discountTitle: discountTitle,
          customerBuyProduct: customerBuyProduct,
          customerGetProduct: customerGetProduct,
          customerBuyProductName: customerBuyProductName,
          customerGetProductName: customerGetProductName,
          customerBuyProductPrice: customerBuyProductPrice,
          customerGetProductPrice: customerGetProductPrice,
          discountTypePercentage: discountType.percentage,
          discountTypeFixed: discountType.fixed,
          discountValue: discountValue,
          discountEndDate: discountEndDate? new Date(discountEndDate):null,
          discountId: data.data.discountAutomaticBxgyCreate.automaticDiscountNode.id,
          shop:shop 
        },
      })
      return true
    } else {
      console.log("error", errors)
      return false
    }

  } catch (error) {
    console.log("error", error)
    return false
  }



}