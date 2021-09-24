import {
  parseISO,
  differenceInHours,
  format,
  formatDistanceToNowStrict,
} from 'date-fns';

const TimeAgo = ({ createdAt }: { createdAt: string }) => {
  const createdAtDate = parseISO(createdAt);
  const diffInHours = differenceInHours(Date.now(), createdAtDate, {
    roundingMethod: 'floor',
  });
  const useRelativeTime = diffInHours < 24;

  return (
    <span
      className="text-sm hover:underline"
      title={format(createdAtDate, 'h:mm a · d MMM y')}
    >
      {useRelativeTime
        ? formatDistanceToNowStrict(createdAtDate, { roundingMethod: 'floor' })
        : format(createdAtDate, 'd MMM y')}
    </span>
  );
};

export default TimeAgo;
