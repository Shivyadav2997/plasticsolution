import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardFooter } from "reactstrap";

import { Nav, NavItem, NavLink, TabPane, TabContent } from "reactstrap";

const CustomTab = ({ tabnames, tabpanes, onChangeEvents, defaultTab = 0 }) => {
  const [tabId, setTabId] = useState(defaultTab);

  useEffect(() => {
    if (onChangeEvents != null && onChangeEvents[tabId] != null) {
      onChangeEvents[tabId]();
    }
  }, [tabId]);
  return (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Nav tabs>
          {tabnames.map((val, index) => {
            return (
              <NavItem key={index.toString()}>
                <NavLink
                  className={tabId === index ? "active" : ""}
                  onClick={() => {
                    setTabId(index);
                  }}
                >
                  {val}
                </NavLink>
              </NavItem>
            );
          })}
        </Nav>
      </CardHeader>
      <TabContent activeTab={tabId.toString()}>
        {tabpanes.map((val, index) => {
          return (
            <TabPane key={index.toString()} tabId={index.toString()}>
              {val}
            </TabPane>
          );
        })}
      </TabContent>
    </Card>
  );
};

export default CustomTab;
