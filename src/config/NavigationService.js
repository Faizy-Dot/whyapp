import { CommonActions, DrawerActions } from '@react-navigation/native';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(name, params) {
  if (_navigator) {
    _navigator.dispatch(
      CommonActions.navigate({
        name,
        params,
      }),
    );
  }
}

function goBack() {
  if (_navigator) {
    _navigator.dispatch(CommonActions.goBack());
  }
}

function resetStack(name, params) {
  if (_navigator) {
    _navigator.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name, params }],
      }),
    );
  }
}

function openDrawer() {
  if (_navigator) {
    _navigator.dispatch(DrawerActions.openDrawer());
  }
}

function closeDrawer() {
  if (_navigator) {
    _navigator.dispatch(DrawerActions.closeDrawer());
  }
}

function getCurrentRoute() {
  if (_navigator && _navigator.getCurrentRoute) {
    return _navigator.getCurrentRoute();
  }
  return null;
}

export default {
  navigate,
  resetStack,
  setTopLevelNavigator,
  goBack,
  openDrawer,
  closeDrawer,
  getCurrentRoute, // Added the method to get current route
};
