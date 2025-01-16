import MetricCardHeader from "./MetricCardHeader";
import MetricCardRoot from "./MetricCardRoot";
import MetricCardContent from "./MetricCardContent";
import MetricCardIcon from "./MetricCardIcon";
import MetricCardValue from "./MetricCardValue";

// metric card using composition pattern

export const MetricCard = {
  Root: MetricCardRoot,
  Icon: MetricCardIcon,
  Header: MetricCardHeader,
  Content: MetricCardContent,
  Value: MetricCardValue,
};
