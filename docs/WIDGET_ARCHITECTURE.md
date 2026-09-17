# Widget Architecture

Widgets are modular components inheriting `BaseWidgetProps`:
```typescript
export interface BaseWidgetProps {
  title: string;
  isLoading: boolean;
  refreshData: () => void;
}
```
