import db from "../db.server.js";

export const deleteDiscount = async (graphql, data) => {

    const discountId = data.discountId;
    const docId = data.docId;

    try {
        const response = await graphql(
            `mutation discountAutomaticDelete($id: ID!) {
        discountAutomaticDelete(id: $id) {
          deletedAutomaticDiscountId
          userErrors {
            field
            code
            message
          }
        }
      }`,
            {
                variables: {
                    "id": discountId
                },
            }
        )

        const data = await response.json();
        const errors = data.data.discountAutomaticDelete.userErrors
        if (!errors.length) {
            await db.discount.delete({
                where: {
                    id: docId
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