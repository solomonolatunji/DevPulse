import { StyleSheet } from 'react-native';

/**
 * Common styles and layout patterns used across the application.
 * Use these to reduce repetition in local StyleSheets.
 */
export const commonStyles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  absoluteFill: {
    ...StyleSheet.absoluteFill,
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
});
