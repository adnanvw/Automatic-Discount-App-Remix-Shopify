import React from 'react';
import { Banner, List } from '@shopify/polaris';
import { useSelector } from "react-redux"

const BannerExampleExtension = () => {

  const { shopData } = useSelector(state => state.shopData)

  const handleAction = () => {
    open(`https://${shopData.domain}/admin/themes/current/editor?context=apps&template=${'product'}&activateAppId=b5835e4b-07a8-4467-9ced-1333bd3a9411/discountBxGy`, '_blank');
  }
  return (
    <Banner
      title="Enable Theme App Extension "
      action={{ content: 'Add Theme App Extension', onAction: () => { handleAction() } }}
      status="warning"

    >
      <List>
        <List.Item>
          Please enable the theme app extension by clicking the button <b>Add Theme App Extension</b> otherwise your app is not going to be functional.<br></br>
          After clicking the button you will be redirected to the theme editor page.Then in the right corner click on <b>Save</b> button.
        </List.Item>
      </List>
    </Banner>
  );
}

export default BannerExampleExtension