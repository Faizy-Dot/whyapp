import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import AppTabsNavigator from "./AppTabsNavigator";
import CustomDrawer from "../../components/CustomDrawer";

const Drawer = createDrawerNavigator();

export default function AppDrawer() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="HomeTabs" component={AppTabsNavigator} />
    </Drawer.Navigator>
  );
}
