import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import ChatsScreen from './chats/ChatsScreen';
import ProfileScreen from './profile/ProfileScreen';
import MyFriendsScreen from './myfriends/MyFriendsScreen.js';
import RequestsScreen from './requests/RequestsScreen';
import FindFriendsScreen from './findfriends/FindFriendsScreen';
import Navbar from '../../components/Navbar.jsx';
import { useSelector } from 'react-redux';
// Import your new screens

const Tab = createBottomTabNavigator();

export default function AppTabsNavigator() {
  const {user} = useSelector(state => state.login)
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => <Navbar title={route.name} user={user} />,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#007bff',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Chats') {
            iconName = 'chatbubbles-outline';
          } else if (route.name === 'Find Friends') {
            iconName = 'search-outline'; // 👈 changed icon for find friends
          } else if (route.name === 'Requests') {
            iconName = 'person-add-outline'; // 👈 icon for requests
          } else if (route.name === 'My Friends') {
            iconName = 'people-outline'; // 👈 icon for my friends
          } else if (route.name === 'Profile') {
            iconName = 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Find Friends" component={FindFriendsScreen} />
      <Tab.Screen name="Requests" component={RequestsScreen} />
      <Tab.Screen name="My Friends" component={MyFriendsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
