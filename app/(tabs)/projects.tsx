import { BottomSheet, Header, ListItem, Typography } from '@/components';
import { ProjectListSkeleton } from '@/components/skeletons';
import { ProjectCard } from '@/features';
import { useDebounce, useProjects, useStats, useTheme } from '@/hooks';
import { WakaTimeLanguage, WakaTimeProject } from '@/interfaces';
import { projectsStyles as styles } from '@/theme';
import { toastSuccess } from '@/utilities';
import Feather from '@react-native-vector-icons/feather/static';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function ProjectsScreen() {
  const { theme } = useTheme();

  const {
    data,
    isLoading,
    isRefetching,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useProjects();

  const [searchQuery, setSearchQuery] = React.useState('');
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [showSearch, setShowSearch] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'recent' | 'name'>('recent');
  const sortSheetRef = React.useRef<BottomSheetModal>(null);

  const projectsData = React.useMemo(() => {
    if (!data?.pages) return [];
    const allProjects = data.pages.flatMap((page) => page.data);

    const seen = new Set();
    return allProjects.filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [data]);

  const filteredProjects = React.useMemo(() => {
    let result = [...projectsData];

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(query));
    }

    result.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      const dateA = new Date(a.last_heartbeat_at || a.created_at).getTime();
      const dateB = new Date(b.last_heartbeat_at || b.created_at).getTime();
      return dateB - dateA;
    });

    return result;
  }, [projectsData, debouncedSearchQuery, sortBy]);

  const { data: allTimeStats } = useStats('all_time');

  const projectAllTimeMap = React.useMemo(() => {
    const map: Record<string, string> = {};
    if (allTimeStats?.data?.projects) {
      allTimeStats.data.projects.forEach((p: WakaTimeLanguage) => {
        map[p.name] = p.text;
      });
    }
    return map;
  }, [allTimeStats]);

  const renderProjectItem = ({ item }: { item: WakaTimeProject }) => {
    return (
      <ProjectCard item={item} allTimeText={projectAllTimeMap[item.name]} />
    );
  };

  const handlePresentSortSheet = React.useCallback(() => {
    sortSheetRef.current?.present();
  }, []);

  const handleSortSelect = (sort: 'recent' | 'name') => {
    setSortBy(sort);
    sortSheetRef.current?.dismiss();
    toastSuccess(`Sorted by ${sort === 'recent' ? 'Recently Active' : 'Name'}`);
  };

  if (isLoading && !data) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        <Header
          title="Projects"
          subtitle={`${projectsData.length} projects tracked`}
          actions={[
            {
              icon: 'filter-variant',
              onPress: handlePresentSortSheet,
            },
            {
              icon: 'magnify',
              onPress: () => setShowSearch(!showSearch),
            },
          ]}
        />
        <ProjectListSkeleton />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Header
        title="Projects"
        subtitle={`${projectsData.length} projects tracked`}
        actions={[
          {
            icon: 'filter-variant',
            onPress: handlePresentSortSheet,
          },
          {
            icon: 'magnify',
            onPress: () => {
              setShowSearch((prev) => !prev);
              if (showSearch) setSearchQuery('');
            },
          },
        ]}
      />

      {showSearch && (
        <View
          style={[
            styles.searchContainer,
            { backgroundColor: theme.colors.surface },
          ]}
        >
          <Feather
            name="search"
            size={20}
            color={theme.colors.textSecondary}
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search projects..."
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Feather name="x" size={18} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredProjects}
        renderItem={renderProjectItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage && !searchQuery) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footerLoader}>
              <ActivityIndicator color={theme.colors.primary} />
            </View>
          ) : (
            <View style={{ height: 40 }} />
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
            progressBackgroundColor={theme.colors.surface}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <View
              style={[
                styles.emptyIconContainer,
                { backgroundColor: theme.colors.border + '20' },
              ]}
            >
              <Feather name="folder" size={48} color={theme.colors.border} />
            </View>
            <Typography
              variant="title"
              weight="semibold"
              style={styles.emptyTitle}
            >
              {searchQuery ? 'No Projects Match' : 'No Projects Found'}
            </Typography>
            <Typography
              color={theme.colors.textSecondary}
              style={styles.emptySubtitle}
            >
              {searchQuery
                ? `No projects found matching "${searchQuery}"`
                : 'Make sure you have projects tracked in WakaTime.'}
            </Typography>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />

      <BottomSheet
        ref={sortSheetRef}
        title="Sort Projects"
        snapPoints={['30%']}
      >
        <View style={{ paddingBottom: 24 }}>
          <ListItem
            title="Recently Active"
            onPress={() => handleSortSelect('recent')}
            showChevron={false}
            rightIcon={
              sortBy === 'recent' ? (
                <Feather name="check" size={20} color={theme.colors.primary} />
              ) : undefined
            }
          />
          <ListItem
            title="Name (A-Z)"
            onPress={() => handleSortSelect('name')}
            showChevron={false}
            rightIcon={
              sortBy === 'name' ? (
                <Feather name="check" size={20} color={theme.colors.primary} />
              ) : undefined
            }
          />
        </View>
      </BottomSheet>
    </View>
  );
}
