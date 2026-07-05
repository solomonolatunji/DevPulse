import { BottomSheet, ListItem, Typography } from '@/components';
import { useTheme } from '@/hooks';
import { WakaTimeOrganization } from '@/interfaces/organization';
import { useOrganizationStore } from '@/stores/useOrganizationStore';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Feather } from '@react-native-vector-icons/feather/static';
import { useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

export function OrganizationSwitcher() {
  const { theme } = useTheme();
  const { organizations, selectedOrganization, selectOrganization } =
    useOrganizationStore();
  const bottomSheetRef = useRef<BottomSheetModal>(null);

  const handleOpen = useCallback(() => {
    bottomSheetRef.current?.present();
  }, []);

  const handleSelect = (org: WakaTimeOrganization | null) => {
    selectOrganization(org);
    bottomSheetRef.current?.dismiss();
  };

  const currentName = selectedOrganization
    ? selectedOrganization.name
    : 'Personal';

  const isPersonal = !selectedOrganization;

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.7}
        style={[
          styles.trigger,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          },
        ]}
      >
        <Typography
          variant="caption"
          weight="semibold"
          style={{ color: theme.colors.text }}
          numberOfLines={1}
        >
          {currentName}
        </Typography>
        <Feather
          name="chevron-down"
          size={14}
          color={theme.colors.textSecondary}
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>

      <BottomSheet
        ref={bottomSheetRef}
        title="Switch Context"
        snapPoints={['40%']}
      >
        <View style={styles.menuContent}>
          <ListItem
            title="Personal Account"
            subtitle="Your individual coding stats"
            onPress={() => handleSelect(null)}
            leftIcon={
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: theme.colors.primary + '15' },
                ]}
              >
                <Feather name="user" size={18} color={theme.colors.primary} />
              </View>
            }
            rightIcon={
              isPersonal ? (
                <Feather name="check" size={20} color={theme.colors.primary} />
              ) : undefined
            }
            showChevron={false}
          />

          <View style={styles.divider} />

          <Typography
            variant="micro"
            weight="bold"
            color={theme.colors.textTertiary}
            style={styles.sectionTitle}
          >
            ORGANIZATIONS
          </Typography>

          {organizations.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Typography color={theme.colors.textSecondary} variant="caption">
                No organizations found
              </Typography>
            </View>
          ) : (
            organizations.map((org) => (
              <ListItem
                key={org.id}
                title={org.name}
                subtitle="Organization stats"
                onPress={() => handleSelect(org)}
                leftIcon={
                  <View
                    style={[
                      styles.iconContainer,
                      { backgroundColor: theme.colors.textSecondary + '15' },
                    ]}
                  >
                    <Feather
                      name="briefcase"
                      size={18}
                      color={theme.colors.textSecondary}
                    />
                  </View>
                }
                rightIcon={
                  selectedOrganization?.id === org.id ? (
                    <Feather
                      name="check"
                      size={20}
                      color={theme.colors.primary}
                    />
                  ) : undefined
                }
                showChevron={false}
              />
            ))
          )}
        </View>
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  menuContent: {
    paddingBottom: 24,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  divider: {
    height: 1,
    marginVertical: 12,
    marginHorizontal: 16,
    opacity: 0.1,
    backgroundColor: '#888',
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
});
