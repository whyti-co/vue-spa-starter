# Modal System

Two examples demonstrating the modal system.

## simple.tsx

Basic modal without routing:
- `Modal` component with `open` prop and `@close` event
- Slot-based content
- Result handling on close

## with-router.tsx

Self-contained multi-step wizard:
- `useQueue` for step management
- Separate `createRouter` with `createMemoryHistory`
- Step components with navigation props
- `Stepper` component showing progress

## Key APIs

```tsx
// Simple modal
<Modal open={isOpen} onClose={handleClose}>
  <div>Content</div>
</Modal>

// Queue for steps
const steps = useQueue<TStep>()
steps.set([...])     // Initialize
steps.next()         // Go forward
steps.prev()         // Go back
steps.insert(item)   // Add dynamically
steps.remove(id)     // Remove by id
steps.current.value  // Current item
steps.hasNext.value  // Can advance?
```
