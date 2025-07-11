import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

interface CalendarEmbedProps {
  type: 'discovery' | 'demo';
}

export const CalendarEmbed: React.FC<CalendarEmbedProps> = ({ type }) => {
  const config = {
    discovery: {
      namespace: "30min",
      calLink: "uplift-tech/30min",
    },
    demo: {
      namespace: "30min",
      calLink: "uplift-tech/30min",
    }
  };

  const selectedConfig = config[type];

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: selectedConfig.namespace });
      cal("ui", {
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, [selectedConfig.namespace]);

  return (
    <Cal
      namespace={selectedConfig.namespace}
      calLink={selectedConfig.calLink}
      style={{
        width: "100%",
        height: "700px",
        borderRadius: "0.75rem",
        overflow: "hidden"
      }}
      config={{
        layout: "month_view",
        theme: "dark",
        hideEventTypeDetails: false,
        styles: {
          body: {
            background: "transparent",
          },
          branding: {
            brandColor: "#9B1DFF",
          },
          enabledDateButton: {
            background: "#9B1DFF",
          },
          selectedDateButton: {
            background: "#9B1DFF",
          }
        }
      }}
    />
  );
};