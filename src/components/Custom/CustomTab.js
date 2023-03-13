import React, { useState } from "react";
import { Card, CardHeader, CardFooter } from "reactstrap";

import { Nav, NavItem, NavLink, TabPane, TabContent } from "reactstrap";

const CustomTab = ({ tabnames, tabpanes, defaultTab = 0 }) => {
  const [tabId, setTabId] = useState(defaultTab);

  return (
    <Card className="shadow">
      <CardHeader className="border-0">
        <Nav tabs>
          {tabnames.map((val, index) => {
            return (
              <>
                <NavItem>
                  <NavLink
                    className={tabId === index && "active"}
                    onClick={() => setTabId(index)}
                  >
                    {val}
                  </NavLink>
                </NavItem>
              </>
            );
          })}
        </Nav>
      </CardHeader>
      <TabContent activeTab={tabId.toString()}>
        {tabpanes.map((val, index) => {
          return <TabPane tabId={index.toString()}>{val}</TabPane>;
        })}
      </TabContent>
      <CardFooter className="py-4">
        <nav aria-label="..."></nav>
      </CardFooter>
    </Card>
  );
};

export default CustomTab;
