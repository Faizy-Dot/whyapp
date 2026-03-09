import DeviceInfo from 'react-native-device-info';
import { Platform } from 'react-native';

const getDeviceDetails = async () => {
    const deviceid = (await DeviceInfo.getUniqueId()).toString();
     const   fcmtoken = "Coming Soon"
    const devicetype = Platform.OS.toString();
    return { deviceid, fcmtoken, devicetype };
};

export default getDeviceDetails;