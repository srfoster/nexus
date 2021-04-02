import Pagination from '@material-ui/lab/Pagination';
import { makeStyles } from '@material-ui/core/styles';

export function textTrim(text, length){
  if (!text) return '';

  if(text.length > length){
    return text.slice(0, length) + '...';
  } else {
    return text;
  }
}

export function BasicPagination() {
  // const classes = useStyles();
  return (
    <div>
      <Pagination count={10} />
    </div>
  );
}
