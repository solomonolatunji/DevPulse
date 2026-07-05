import { Feather } from '@react-native-vector-icons/feather/static';
import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons/static';

declare global {
  type FeatherIconName = React.ComponentProps<typeof Feather>['name'];
  type MaterialDesignIconName = React.ComponentProps<
    typeof MaterialDesignIcons
  >['name'];
}
