import React from "react";
import TestRenderer from "react-test-renderer";

export const mountTest = (Component: React.ComponentType) => {
  describe(`mount and unmount`, () => {
    it(`component could be updated and unmounted without errors`, () => {
      expect(() => {
        const wrapper = TestRenderer.create(<Component />);
        wrapper.unmount();
      }).not.toThrow();
    });
  });
};
