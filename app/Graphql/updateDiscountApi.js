import db from "../db.server.js";

export const updateDiscount = async (graphql, data,shop) => {

  const { discountTitle, customerBuyProduct, customerGetProduct, customerGetProductName, customerBuyProductName, discountType, discountValue, discountEndDate, customerGetProductPrice, customerBuyProductPrice } = data.data

  const discountId=data.discountId;
  const docId=data.docId;

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
      `mutation discountAutomaticBxgyUpdate($automaticBxgyDiscount: DiscountAutomaticBxgyInput!, $id: ID!) {
        discountAutomaticBxgyUpdate(automaticBxgyDiscount: $automaticBxgyDiscount, id: $id) {
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
          },
          "id":discountId
        },
      }
    )

    const data = await response.json();
    const errors = data.data.discountAutomaticBxgyUpdate.userErrors
    if (!errors.length) {
      await db.discount.update({
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
          discountId: data.data.discountAutomaticBxgyUpdate.automaticDiscountNode.id,
          shop:shop 
        },
        where:{
            id:docId
        }
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