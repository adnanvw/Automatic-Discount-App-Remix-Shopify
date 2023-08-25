import React from 'react'
import { LegacyCard, Page, Tabs } from '@shopify/polaris';
import { useState, useCallback } from 'react';
import DiscountSettings from '~/components/DiscountSettings';
import ViewDiscounts from '~/components/ViewDiscounts';
import ToastExample from '~/components/Toast';
import Circular from '~/components/Circular';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { resetUpdateOfferData } from '../redux/updateOfferData';
import { enterShopData } from '../redux/shopInfoReducer.js';
import styles from "../components/circular.css";
import BannerExampleExtension from '~/components/BannerExtension';


export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

const index = () => {
  const [selected, setSelected] = useState(0);

  const [appEmbededBlockDisabled, setAppEmbededBlockDisabled] = useState(false)

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    [],
  );

  const { isUpdate } = useSelector(state => state.updateOfferData)

  const reduxDispatch = useDispatch()

  const getShopInfo = async () => {
    const response = await fetch("/api/getShopInfo", {
      method: "GET",
    })
    if (response.status >= 200 && response.status <= 299) {
      const jsonData = await response.json()
      reduxDispatch(enterShopData(jsonData.shopData))
    }
    else {
      const jsonData = await response.json()
      console.log(jsonData)
    }
  }

  useEffect(() => {
    if (isUpdate) {
      setSelected(0)
    }
  }, [isUpdate])

  useEffect(() => {
    if (selected !== 0 && isUpdate) {
      reduxDispatch(resetUpdateOfferData())
    }
  }, [selected])

  useEffect(() => {
    getShopInfo()
  }, [])

  const switchTabAfterCreateOrUpdate = () => {
    setSelected(1)
  }

  const tabs = [
    {
      id: 'Create Discounts',
      content: `${!isUpdate ? "Create Discounts" : "Update Discounts"}`,
      accessibilityLabel: 'Create Discounts',
      panelID: 'Create Discounts',
      component: <DiscountSettings switchTabAfterCreateOrUpdate={switchTabAfterCreateOrUpdate} />
    },
    {
      id: 'View Discounts',
      content: 'View Discounts',
      panelID: 'View Discounts',
      component: <ViewDiscounts />
    },

  ];


  const checkEmbededAppBlock = async () => {
    const response = await fetch("/api/checkAppEmbededBlock", {
      method: "GET"
    })
    if (response.status >= 200 && response.status <= 299) {
      const jsonData = await response.json()
      setAppEmbededBlockDisabled(jsonData.appEmbededBlockDisabled)
    }
    else {
      const jsonData = await response.json()
      console.log(jsonData)
    }
  }

  useEffect(() => {
    checkEmbededAppBlock()
  }, [])

  return (
    <>
      <Circular />
      <Page fullWidth>
        <LegacyCard>
          {appEmbededBlockDisabled && <BannerExampleExtension />}
        </LegacyCard>
        <LegacyCard>
          <Tabs tabs={tabs} selected={selected} onSelect={handleTabChange}>
            <LegacyCard.Section>
              {
                tabs[selected].component
              }
            </LegacyCard.Section>
          </Tabs>
        </LegacyCard>
      </Page>
      <ToastExample />
    </>
  )
}

export default index