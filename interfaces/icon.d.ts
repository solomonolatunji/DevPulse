import Feather from '@react-native-vector-icons/feather/static';
import MaterialCommunityIcons from '@react-native-vector-icons/material-design-icons/static';

declare global {
  type FeatherIconName = keyof typeof Feather.glyphMap;
  type MaterialIconName = keyof typeof MaterialCommunityIcons.glyphMap;
}
