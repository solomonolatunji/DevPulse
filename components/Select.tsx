import { useTheme } from '@/hooks/useTheme';
import { BottomSheetFlatList, BottomSheetModal } from '@gorhom/bottom-sheet';
import { Feather } from '@react-native-vector-icons/feather/static';
import React, { useMemo, useRef, useState } from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  TextInput,
  View,
  ViewStyle,
} from 'react-native';
import { BottomSheet } from './BottomSheet';
import { Typography } from './Typography';

export interface SelectOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  category?: string;
}

interface SelectProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: SelectOption[];
  onSelect: (value: string) => void;
  title?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  error?: string;
  categories?: string[];
  hideSearch?: boolean;
  snapPoints?: string[];
  triggerStyle?: StyleProp<ViewStyle>;
  compact?: boolean;
}

export function Select({
  label,
  placeholder,
  value,
  options,
  onSelect,
  title,
  searchPlaceholder = 'Search...',
  disabled = false,
  error,
  categories,
  hideSearch = false,
  snapPoints,
  triggerStyle,
  compact = false,
}: SelectProps) {
  const { theme } = useTheme();
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(categories?.[0] || '');

  const selectedOption = useMemo(
    () => options.find((opt) => opt.value === value),
    [options, value],
  );

  const filteredOptions = useMemo(() => {
    let filtered = options;

    if (categories && categories.length > 0 && activeCategory) {
      filtered = filtered.filter(
        (opt) => opt.category?.toLowerCase() === activeCategory.toLowerCase(),
      );
    }

    if (!searchQuery) return filtered;
    const query = searchQuery.toLowerCase();
    return filtered.filter((opt) => opt.label.toLowerCase().includes(query));
  }, [options, searchQuery, categories, activeCategory]);

  const handleOpen = () => {
    if (disabled) return;
    setSearchQuery('');
    bottomSheetRef.current?.present();
  };

  const handleSelect = (option: SelectOption) => {
    onSelect(option.value);
    bottomSheetRef.current?.dismiss();
  };

  const sheetSnapPoints = useMemo(() => snapPoints || ['60%'], [snapPoints]);

  return (
    <>
      <View style={styles.container}>
        {label && !compact && (
          <Typography
            variant="caption"
            weight="medium"
            style={{ marginBottom: 8, color: theme.colors.text }}
          >
            {label}
          </Typography>
        )}
        <Pressable
          onPress={handleOpen}
          style={[
            styles.trigger,
            {
              backgroundColor: theme.colors.surface,
              borderColor: error ? theme.colors.error : theme.colors.border,
              opacity: disabled ? 0.6 : 1,
            },
            triggerStyle,
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            {selectedOption?.icon}
            <Typography
              variant="body"
              color={
                selectedOption ? theme.colors.text : theme.colors.textTertiary
              }
            >
              {selectedOption ? selectedOption.label : placeholder || 'Select'}
            </Typography>
          </View>
          <Feather
            name="chevron-down"
            size={compact ? 16 : 20}
            color={theme.colors.textTertiary}
          />
        </Pressable>
        {error && (
          <Typography
            variant="caption"
            color={theme.colors.error}
            style={{ marginTop: 4 }}
          >
            {error}
          </Typography>
        )}
      </View>

      <BottomSheet
        ref={bottomSheetRef}
        title={title || `Select ${label}`}
        snapPoints={sheetSnapPoints}
      >
        <BottomSheetFlatList<SelectOption>
          showsVerticalScrollIndicator={false}
          data={filteredOptions}
          keyExtractor={(item) => item.value}
          renderItem={({ item }: { item: SelectOption }) => (
            <Pressable onPress={() => handleSelect(item)}>
              {({ pressed }) => (
                <View
                  style={[
                    styles.optionItem,
                    {
                      backgroundColor: pressed
                        ? theme.colors.primary
                        : theme.colors.surfaceHighlight,
                      borderColor: theme.colors.border,
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    {item.icon}
                    <Typography
                      variant="body"
                      color={
                        pressed
                          ? theme.colors.primaryForeground
                          : theme.colors.text
                      }
                    >
                      {item.label}
                    </Typography>
                  </View>
                  <Feather
                    name="chevron-right"
                    size={18}
                    color={
                      pressed
                        ? theme.colors.primaryForeground
                        : theme.colors.textTertiary
                    }
                  />
                </View>
              )}
            </Pressable>
          )}
          ListHeaderComponent={
            <View>
              {categories && categories.length > 0 && (
                <View
                  style={[
                    styles.tabsContainer,
                    { backgroundColor: theme.colors.surface },
                  ]}
                >
                  {categories.map((cat) => {
                    const isActive = activeCategory === cat;
                    return (
                      <Pressable
                        key={cat}
                        onPress={() => setActiveCategory(cat)}
                        style={[
                          styles.tab,
                          {
                            backgroundColor: isActive
                              ? theme.colors.surfaceHighlight
                              : 'transparent',
                            borderWidth: 1,
                            borderColor: isActive
                              ? theme.colors.primary
                              : 'transparent',
                          },
                        ]}
                      >
                        <Typography
                          variant="caption"
                          weight={isActive ? 'bold' : 'medium'}
                          color={
                            isActive
                              ? theme.colors.text
                              : theme.colors.textSecondary
                          }
                          style={{ textTransform: 'capitalize' }}
                        >
                          {cat}
                        </Typography>
                      </Pressable>
                    );
                  })}
                </View>
              )}
              {!hideSearch && (
                <View style={styles.searchContainer}>
                  <View
                    style={[
                      styles.searchInputWrapper,
                      {
                        backgroundColor: theme.colors.background,
                        borderColor: theme.colors.border,
                      },
                    ]}
                  >
                    <Feather
                      name="search"
                      size={20}
                      color={theme.colors.textTertiary}
                      style={{ marginRight: 8 }}
                    />
                    <TextInput
                      placeholder={searchPlaceholder}
                      placeholderTextColor={theme.colors.textTertiary}
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      style={[styles.searchInput, { color: theme.colors.text }]}
                    />
                  </View>
                </View>
              )}
            </View>
          }
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: 16 },
          ]}
        />
      </BottomSheet>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 50,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 16,
  },
  searchContainer: {
    paddingBottom: 16,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  listContent: {
    paddingBottom: 16,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    padding: 4,
    borderRadius: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
});
