import { ReactNode, ErrorInfo, Component } from 'react'; // , Suspense, lazy
// import { Link } from "react-router-dom";
import { Result, Button } from 'antd';
import { useNavigation } from "@refinedev/core"; // useGetIdentity
// import { useLocation } from 'react-router-dom'; 

interface ErrorBoundaryProps {
  children?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}
interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(){ // error: Error
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo){
    this.props.onError?.(error, errorInfo);
  }

  render() {
    return this.state.hasError ? (
      <Result
        status="warning"
        title="Something went wrong"
        subTitle={!navigator.onLine && "No internet connection"}
        extra={
          <ButtonBackTo ghost />
        }
      />
    )
    :
    this.props.children
  }
}

const ButtonBackTo = (props: any) => {
  // const { data: user } = useGetIdentity<any>();
  const { push } = useNavigation();

  const backTo = () => { // e: any
    let path = "/";
    
    if(window.location.pathname.startsWith('/admin')){
      path += "admin";
    }

    // if(user?.name === 'system'){
    //   path += "admin";
    // }
    
    push(path);

    // props?.onClick?.(e);
  }

  // Not render when in home page
  if(['/', '/admin'].includes(window.location.pathname)){
    return null;
  }

  return (
    <Button
      type="primary"
      {...props}
      onClick={backTo}
    >
      Back to Home
    </Button>
  );
}
