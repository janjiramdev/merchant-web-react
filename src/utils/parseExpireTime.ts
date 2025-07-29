export const parseExpireTime = (str: string): Date => {
  const now = new Date();
  const match = str.match(/^(\d+)([smhd])$/);

  if (!match) {
    now.setHours(now.getHours() + 1);
    return now;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;
    case 'm':
      now.setMinutes(now.getMinutes() + value);
      break;
    case 'h':
      now.setHours(now.getHours() + value);
      break;
    case 'd':
      now.setDate(now.getDate() + value);
      break;
  }
  return now;
};
